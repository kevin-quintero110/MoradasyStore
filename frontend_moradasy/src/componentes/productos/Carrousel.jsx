import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Carrousel() {
  return (
    <div className="container-fluid p-0">
      <div
        id="carouselExampleIndicators"
        className="carousel slide bg-dark p-4"
        data-bs-ride="carousel"  // Habilita el auto-slide
        data-bs-interval="3000"   // Intervalo de 1 segundo entre las transiciones (1000 ms)
        style={{
          width: "100%", 
          margin: "0 auto",
          maxHeight: "400px",
        }}
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <img
                src="http://localhost:3000/uploads/1NnnmKgXJ.jpeg"
                className="d-block"
                alt="camiseta 1"
              />
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <img
                src="http://localhost:3000/uploads/oQqRbXvFH.jpeg"
                className="d-block"
                alt="camiseta 2"
              />
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <img
                src="http://localhost:3000/uploads/yhblgzOCO.jpeg"
                className="d-block"
                alt="camiseta 3"
              />
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Carrousel;
