const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);
    
    const authority = "0x060cdFa63Afc85b1a376c46BfCaF16a8C8E9Ac06";

    const Catheon = await ethers.getContractFactory("CatheonBEP20Token");
    const catheon = await Catheon.deploy(authority);  

    const XCatheon = await ethers.getContractFactory("xCatheon");
    const xCatheon = await XCatheon.deploy();

    const CatheonStaking = await ethers.getContractFactory("CatheonStaking");
    const staking = await CatheonStaking.deploy(
        catheon.address,
        xCatheon.address,
        authority
    );   

    await xCatheon.initialize(staking.address);
    // await catheon.initialize(staking.address);

    console.log("Catheon: " + catheon.address);
    
    console.log("Staked Catheon: " + xCatheon.address);
    console.log("Staking Contract: " + staking.address);
   
}

main()
    .then(() => process.exit())
    .catch((error) => { 
        console.error(error);
        process.exit(1);
    });
