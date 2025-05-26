 const error = {
   e401: (req, res, err) => {
     res.status(401).json({
       error: "Authorization Required",
       message: err?.message || "Unauthorized access",
     });
   },
   e403: (req, res, err) => {
     res.status(403).json({
       error: "Forbidden",
       message: err?.message || "Access forbidden",
     });
   },
   e404: (req, res) => {
     res.status(404).json({
       error: "Not Found",
       message: "El recurso que estás buscando no existe.",
     });
   },
   e500: (req, res, err) => {
     res.status(500).json({
       error: "Internal Server Error",
       message: err?.message || "Something went wrong on the server.",
     });
   },
 };

 export default error;
