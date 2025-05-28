import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./aichatbot.css";

const AIChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // 처음 로드될 때 sessionStorage에서 초기 메시지 가져오기
  useEffect(() => {
    const initialQuery = sessionStorage.getItem("initialQuery");
    if (initialQuery) {
      sessionStorage.removeItem("initialQuery"); // 사용 후 삭제
      sendMessage(initialQuery); // 바로 메시지 전송
    }
  }, []);

  const sendMessage = async (message = userInput) => {
    if (!message.trim()) return;

    setUserInput(""); // 메시지 입력 필드 초기화

    const newChat = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newChat); // 채팅 내역에 사용자 메시지 추가

    try {
      // 서버 API에 메시지 전송 (POST 요청)
      const response = await fetch("/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message, // 사용자 입력을 query로 전송
        }),
      });

      if (!response.ok) throw new Error("서버 응답 오류");

      const data = await response.json(); // 서버 응답 데이터 받기

      setChatHistory([
        ...newChat,
        { role: "assistant", content: data.response }, // AI의 응답 추가
      ]);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 스크롤을 항상 채팅 최하단으로 유지
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Enter 키로 줄바꿈 방지
      sendMessage(); // 메시지 전송
    }
  };

  return (
    <div className="ai-chatbot">
      <Navbar />
      <Header activeItem="AI" />
      <div className="chat-container">
        <h1>AI Chatbot</h1>
        <div className="chat-box" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <span className="sender">
                {msg.role === "user" ? "👤 You" : "🤖 AI"}
              </span>
              <div className="message-content">
                {msg.role === "assistant" ? (
                  msg.content.split("\n").map((line, i) => {
                    if (line.startsWith("링크: ")) {
                      const relativePath = line.replace("링크: ", "").trim();
                      const url = `/graduation-front_end#${relativePath}`;
                      return (
                        <div key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-button"
                          >
                            숙소 페이지 새 탭으로 열기
                          </a>
                        </div>
                      );
                    } else {
                      return <div key={i}>{line}</div>;
                    }
                  })
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
          />
          <button onClick={() => sendMessage()} className="send-button">
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
