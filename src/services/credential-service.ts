import { Request, Response } from "express";
import crypto from "crypto"
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
    }
      
    const credentials = require(`../credentials/${app}-credentials.json`).credentials;
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
  const credentialsData: object = req.body.credentialsData

  try {
    console.log(
      "[info]",
      "[ CREDENTIALS | credential-service.ts ] data to create credential file:",
      `\n${JSON.stringify(credentialsData)}`
    );

    await addCredentialData(folderName, credentialsData);
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
