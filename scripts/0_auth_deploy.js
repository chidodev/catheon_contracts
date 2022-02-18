const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account: " + deployer.address);
   
    const Authority = await ethers.getContractFactory("CatheonAuthority");
    const authority = await Authority.deploy(
        deployer.address,
        deployer.address,      
        deployer.address
    );

    
    console.log("Auth Contract: " + authority.address);
    
}

main()
    .then(() => process.exit())
    .catch((error) => { 
        console.error(error);
        process.exit(1);
    });
