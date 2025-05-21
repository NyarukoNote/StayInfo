import axios from "axios";
import categoryData from "./categoryData.json";

const API_KEY = process.env.REACT_APP_API_KEY;
const DB_NAME = "CategoryDB";
const STORE_NAME = "categories";

/**
 * IndexedDB에서 데이터 가져오기
 * @param {string} key - 카테고리 키 (cat1-cat2-cat3)
 * @returns {Promise<string|null>} 카테고리 이름 (없으면 null)
 */
async function getFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject("❌ IndexedDB에서 데이터 가져오기 실패");
    };

    request.onerror = () => reject("❌ IndexedDB 열기 실패");
  });
}

/**
 * IndexedDB에 데이터 저장하기
 * @param {string} key - 카테고리 키 (cat1-cat2-cat3)
 * @param {string} value - 카테고리 이름
 */
async function saveToIndexedDB(key, value) {
  const request = indexedDB.open(DB_NAME, 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(value, key);
  };
}

/**
 * JSON/IndexedDB에서 카테고리 이름을 가져오고, 없으면 API 요청 후 IndexedDB에 저장
 * @param {string} cat1 - 대분류 코드
 * @param {string} cat2 - 중분류 코드
 * @param {string} cat3 - 소분류 코드
 * @returns {Promise<string>} 카테고리 이름
 */
export async function getCategoryName(cat1, cat2, cat3) {
  const key = `${cat1}-${cat2}-${cat3}`;

  // ✅ 1️⃣ JSON 파일 확인
  if (categoryData[key]) {
    return categoryData[key]; // 🔹 JSON에 데이터가 있으면 반환
  }

  // ✅ 2️⃣ IndexedDB에서 데이터 확인
  const cachedValue = await getFromIndexedDB(key);
  if (cachedValue) {
    return cachedValue; // 🔹 IndexedDB에서 데이터가 있으면 반환
  }

  // ✅ 3️⃣ 데이터가 없으면 API 요청
  const API_URL = `https://apis.data.go.kr/B551011/KorService1/categoryCode1?MobileOS=ETC&MobileApp=apptest&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}&serviceKey=${API_KEY}&_type=json`;

  try {
    const response = await axios.get(API_URL);
    const items = response.data?.response?.body?.items?.item;

    if (!items || items.length === 0) {
      return "알 수 없음"; // ❌ API에서도 데이터를 찾을 수 없음
    }

    const categoryName = items[0].name; // ✅ 첫 번째 항목의 카테고리 이름 저장

    // ✅ 4️⃣ 새로운 데이터를 IndexedDB에 저장
    await saveToIndexedDB(key, categoryName);

    return categoryName;
  } catch (error) {
    console.error("❌ 카테고리 가져오기 실패:", error);
    return "알 수 없음";
  }
}
