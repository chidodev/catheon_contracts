const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);

    const firstEpochNumber = "1";
    const firstBlockNumber = "1";
  
    const authority = "0x060cdFa63Afc85b1a376c46BfCaF16a8C8E9Ac06";

    const catheonAddress = "0x4f60985349b825e975C1527029A6410117043b30";
    const xCatheonAddress = "0xa403E131E17601B515B09d340037F39F8265699C";
 
    const CatheonStaking = await ethers.getContractFactory("CatheonStaking");
    const staking = await CatheonStaking.deploy(
        catheonAddress,
        xCatheonAddress,
        "2200",
        firstEpochNumber,
        firstBlockNumber,
        authority
    );   
   
    console.log("Staking Contract: " + staking.address);
    // console.log("Distributor: " + distributor.address);
}

main()
    .then(() => process.exit())
    .catch((error) => { 
        console.error(error);
        process.exit(1);
    });
