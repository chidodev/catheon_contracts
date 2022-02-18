import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, smock } from "@defi-wonderland/smock";

import {
    CatheonStaking,
    
    CatheonBEP20Token,
    CatheonBEP20Token__factory,
    XCatheon,
    XCatheon__factory,    
    CatheonAuthority__factory,
} from "../../types";

const TOTAL_GONS = 5000000000000000;
const ZERO_ADDRESS = ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

describe("Catheon", () => {
    let initializer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let catheon: CatheonBEP20Token;
    let xCatheon: XCatheon;
    
    let stakingFake: FakeContract<CatheonStaking>;
    

    beforeEach(async () => {
        [initializer, alice, bob] = await ethers.getSigners();
        stakingFake = await smock.fake<CatheonStaking>("CatheonStaking");

        const authority = await new CatheonAuthority__factory(initializer).deploy(
            initializer.address,
            initializer.address,
            initializer.address
        );
        catheon = await new CatheonBEP20Token__factory(initializer).deploy(authority.address);
        xCatheon = await new XCatheon__factory(initializer).deploy();
    });

    it("is constructed correctly", async () => {
        expect(await catheon.name()).to.equal("Catheon");
        expect(await catheon.symbol()).to.equal("CHN");
        expect(await catheon.decimals()).to.equal(9);
    });

   
    describe("post-initialization", () => {
        
        describe("approve", () => {
            it("sets the allowed value between sender and spender", async () => {
                await catheon.connect(alice).approve(bob.address, 10);
                expect(await catheon.allowance(alice.address, bob.address)).to.equal(10);
            });

            it("emits an Approval event", async () => {
                await expect(await catheon.connect(alice).approve(bob.address, 10))
                    .to.emit(catheon, "Approval")
                    .withArgs(alice.address, bob.address, 10);
            });
        });

        describe("increaseAllowance", () => {
            it("increases the allowance between sender and spender", async () => {
                await catheon.connect(alice).approve(bob.address, 10);
                await catheon.connect(alice).increaseAllowance(bob.address, 4);

                expect(await catheon.allowance(alice.address, bob.address)).to.equal(14);
            });

            it("emits an Approval event", async () => {
                await catheon.connect(alice).approve(bob.address, 10);
                await expect(await catheon.connect(alice).increaseAllowance(bob.address, 4))
                    .to.emit(catheon, "Approval")
                    .withArgs(alice.address, bob.address, 14);
            });
        });

        describe("decreaseAllowance", () => {
            it("decreases the allowance between sender and spender", async () => {
                await xCatheon.connect(alice).approve(bob.address, 10);
                await xCatheon.connect(alice).decreaseAllowance(bob.address, 4);

                expect(await xCatheon.allowance(alice.address, bob.address)).to.equal(6);
            });

            it("will not make the value negative", async () => {
                await xCatheon.connect(alice).approve(bob.address, 10);
                await xCatheon.connect(alice).decreaseAllowance(bob.address, 11);

                expect(await xCatheon.allowance(alice.address, bob.address)).to.equal(0);
            });

            it("emits an Approval event", async () => {
                await xCatheon.connect(alice).approve(bob.address, 10);
                await expect(await xCatheon.connect(alice).decreaseAllowance(bob.address, 4))
                    .to.emit(xCatheon, "Approval")
                    .withArgs(alice.address, bob.address, 6);
            });
        });

    });
});
