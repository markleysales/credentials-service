import { Request, Response } from "express";
import * as crypto from "crypto";
import { addCredentialData, createCredentialFile } from "../credentials/fs-config";

interface InputCustomData {
  login: string;
  password: string;
};
interface Result {
  success: boolean;
  application: string;
  enviroment: string;
  credentials: any;
};

// encryption machine info
const encryption_alg: string = 'aes-256-cbc';
const init_vector: Buffer = crypto.randomBytes(16);
const security_key: Buffer = crypto.randomBytes(32);


async function getCredentials (req: Request, res: Response) {
  try {
    // data to validation
    const inputCustomData: InputCustomData = {
      login: req.query.login + "",
      password: req.query.password + "",
    };

    // data to credentials
    const app: string = req.params.app.toLowerCase();
    const env: string = req.query.env + "";
    const channel: string = req.query.channel + "";

    if (!req.params.app || !req.query.env || !req.query.channel) {
      
      res.status(406).json("requires application and environment data");
    };
    
    // fetch encrypted data
    let encrypted_data: string = require(`../credentials/${app}-credentials.json`);

    // decipher initialization
    const decipher: crypto.Decipher = crypto.createDecipheriv(
      encryption_alg, security_key, init_vector
    );
    
    // decryption
    let decrypted_data: string = decipher.update(
      encrypted_data, 'hex', 'utf-8'
    );

    // decipher enclosure
    decrypted_data += decipher.final('utf-8')

    const credentials = JSON.parse(decrypted_data).credentials
    const result: Result = {
      success: true,
      application: app.toUpperCase(),
      enviroment: env.toUpperCase(),
      credentials: credentials[env][channel]
    };
    console.log(
      "\n[info]",
      "[ CREDENTIALS | credential-service.ts ] return credentials:",
      `\n${JSON.stringify(result.credentials)}`
    );
    
    res.status(200).json(result);
  }
  catch (error) {

    res.status(500).json(error);
  };
};

async function addCredentials (req: Request, res: Response) {
  const folderName: string = req.body.folderName;
  const credentialsData: object = req.body.credentialsData;

  await console.log(credentialsData);

  // cipher initialization
  const cipher: crypto.Cipher = crypto.createCipheriv(
    encryption_alg, security_key, init_vector
  );
  
  // encryption
  let encrypted_CredentialsData: string = cipher.update(
    JSON.stringify(credentialsData), 'utf-8', 'hex'
  );

  // cipher enclosure
  encrypted_CredentialsData += cipher.final("hex");

  await console.log(encrypted_CredentialsData);


  try {
    console.log(
      "[info]",
      "[ CREDENTIALS | credential-service.ts ] data to create credential file:",
      `\n${JSON.stringify(credentialsData)}`
    );

    await addCredentialData(folderName, encrypted_CredentialsData);
    await createCredentialFile(folderName);

    res.status(200).json(`credential file successfully created: ${folderName}`);
  }
  catch (error) {
    console.log(
      "[error]",
      "[ CREDENTIALS | credential-service.ts ] create credential file error:",
      `\n${error}`
    )

    res.status(500).json(`create credential file error: ${error}`);
  };
};

export { getCredentials, addCredentials };
