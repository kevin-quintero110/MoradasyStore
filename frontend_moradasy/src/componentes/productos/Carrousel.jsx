import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Carrousel() {
  return (
    <div className="container-fluid p-0">
      <div
        id="carouselExampleIndicators"
        className="carousel slide prueba p-4"
        data-bs-ride="carousel"  
        data-bs-interval="9000"  
        style={{
          width: "100%", 
          margin: "0 auto",
          maxHeight: "400px",
        }}
      >
        
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "350px", overflow: "hidden" }}
            >
              <img
                src="http://localhost:3000/uploads/Banner1.jpg"
                className="d-block"
                alt="camiseta 1"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="carousel-item">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "350px", overflow: "hidden" }}
            >
              <img
                src="http://localhost:3000/uploads/Banner1.jpg"
                className="d-block"
                alt="camiseta 1"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
