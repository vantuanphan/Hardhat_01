// Day la file test. Hardhat se chay cac file .js trong file test
// Hardhat tests thuong viet bang Mocha hoac Chai
// import Chai de su dung ham xac nhan cua no
const { expect } = require("chai");

// Su dung loadFixture
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// Ham describe trong Mocha giup sap xep cac bai test de test de dang hon
describe("Token contract", function () {
  // Su dung Fixture de chay thiet lap
  async function deployTokenFixture() {
    // Lay nguoi dang ky
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Trien khai hop dong
    const hardhatToken = await ethers.deployContract("Token");
    await hardhatToken.waitForDeployment();

    // Tra ve vat so huu
    return { hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    // it la mot ham cua Mocha
    // Trong it se la mot khoi test
    it("Should set the right owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // Ktra chu so huu luu trong hop dong co trung voi nguoi dang ky khong?
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Chuyen 50 token tu owner sang addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Chuyen 50 token tu addr1 sang addr2
      // Su dung .connect(signer) de gui giao dich tu accounts khac nhau
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Chuyen 50 token t owner sang addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Chuyen 50 token tu addr1 sang addr2
      // Su dung .connect(signer) de gui giao dich tu accounts khac nhau
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Gui thong bao tu addr1 cho owner.
      // require se danh gia va hoan giao dich
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // So du cua balance khong nen thay doi
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});