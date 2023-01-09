import fs from "fs-extra"

async function addCredentialData (folderName: string, credentialsData: object) {
  fs.appendFile(
    folderName,
    JSON.stringify(credentialsData), 
    async (error) => {
      if (error) {
        return console.log(error);
      }
      else {
        return console.log(
          "\n[info]",
          "[ CREDENTIALS | credential-service.ts ] file created successfully!"
        )
      }
  });
};

async function createCredentialFile (folderName: string) {
  fs.move(
    folderName, 
    `./src/credentials/${folderName}`, 
    { overwrite: true },
    async (error) => {
      if (error) {
        return console.log(error);
      }
      else {
        return console.log(
          "\n[info]",
          "[ CREDENTIALS | credential-service.ts ] file moved successfully!"
        )
      };
    }
  );
}

export { addCredentialData, createCredentialFile };