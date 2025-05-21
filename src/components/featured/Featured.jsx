import "./featured.css";
import { Link } from "react-router-dom";
import MotelPage from "../../pages/motelpage/Motelpage";

const Featured = () => {
  const featuredItems = [
    {
      city: "Dublin",
      properties: 123,
      imageUrl: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=",
      motelId: "dublin" // 각 모텔을 식별할 고유 ID
    },
    {
      city: "Reno",
      properties: 533,
      imageUrl: "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o=",
      motelId: "reno"
    },
    {
      city: "Austin",
      properties: 532,
      imageUrl: "https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o=",
      motelId: "austin"
    }
  ];

  return (
    <div className="featured">
      {featuredItems.map((item) => (
        <div className="featuredItem" key={item.motelId}>
          <Link to={`/motel`}> {}
            <img
              src={item.imageUrl}
              alt={item.city}
              className="featuredImg"
            />
          </Link>
          <div className="featuredTitles">
            <h1>{item.city}</h1>
            <h2>{item.properties} properties</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Featured;