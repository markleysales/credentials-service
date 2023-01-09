import { Router } from "express";

import { 
  getCredentials, 
  addCredentials 
} from "../services/credential-service";

const route = Router();

route.get("/credentials/:app", getCredentials)
route.post("/credentials/create", addCredentials);

export default route; 

