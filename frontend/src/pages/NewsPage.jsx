import React from "react";
import "../css_class/NewsPage.css";

function Article({ imgSrc, title, content, link }) {
  return (
    <div className="article">
      <img src={imgSrc} alt={title} />
      <h2 className="font-bold">{title}</h2>
      <p>{content}</p>
      <p>
        <a href={link} className="text-blue-500 font-normal">
          Đọc tiếp
        </a>
      </p>
    </div>
  );
}
export default function NewsPage() {
  return (
    <div className="news">
      <header>
        <h1 className="text-2xl font-bold">Tin tức khách sạn</h1>
      </header>
      <section>
        <div className="article-container" id="articleContainer">
          <Article
            imgSrc="https://i1-dulich.vnecdn.net/2023/05/29/hotel-overview-1685329656.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=xoMMhrqwdu6ft6vPs4PZIQ"
            title="10 khách sạn sang trọng nhất Việt Nam 2023"
            content="Đà Nẵng có 3 đại diện được vinh danh trong top 10 khách sạn sang trọng nhất Việt Nam, trong khi Khánh Hòa đứng thứ hai."
            link="#"
          />
          <Article
            imgSrc="https://i1-dulich.vnecdn.net/2023/03/24/1-1679674611.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=FVOUTsssZa4PBlOVNZkd6w"
            title="7 resort báo Mỹ chọn 'Tốt nhất Việt Nam'"
            content="Tạp chí du lịch Mỹ CnTraveler nhận xét gần đây nhiều khách sạn Việt Nam bắt đầu lọt vào danh sách hàng đầu thế giới."
            link="#"
          />
          <Article
            imgSrc="https://i1-dulich.vnecdn.net/2022/07/11/danang11-1657505053-1657535119.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=IxVO0_vBJTC5GHVDJNc_8Q"
            title="Năm khách sạn có bể bơi trên cao ở Đà Nẵng"
            content="Đến Đà Nẵng, du khách không chỉ tắm biển mà có thể ngâm mình trong bể bơi trên tầng thượng các khách sạn, nhìn ra biển hoặc thành phố."
            link="#"
          />
          <Article
            imgSrc="https://i1-dulich.vnecdn.net/2020/07/03/3-1593765775-2554-1593765819.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=ts6-7b9zfCEr5mitZNTpUg"
            title="Altara Suites Đà Nẵng ưu đãi giá phòng nghỉ dịp hè"
            content="Theo đó, khách sạn Altara Suites Đà Nẵng ưu đãi giá phòng 690.000 đồng mỗi người một đêm khi khách đặt phòng cho hai người trở lên, miễn phí cho trẻ em dưới 5 tuổi, trẻ em từ 5 - dưới 12 tuổi phụ thu 180.000 đồng một đêm."
            link="#"
          />
        </div>
        <div id="loadMore">
          <button id="loadMoreBtn">Xem thêm</button>
        </div>
      </section>
    </div>
  );
}
