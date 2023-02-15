import { ethers } from "hardhat";
import { any } from "hardhat/internal/core/params/argumentTypes";

async function main() {
  const [addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
  const _contenders = ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"];
  const ONE_GWEI = 1_000_000_000;



  const VoteContract = await ethers.getContractFactory("voteContract");
  const voteContract = await VoteContract.deploy("Nonso", "NC", 30);
  await voteContract.deployed


  const tokenAddress = await voteContract.address;

  console.log(`The token contract address is ${tokenAddress}`);

  await voteContract.registerContenders(_contenders);

  const contenders = await voteContract.getContenders();

  console.log(`Our contenders for this round are: ${contenders}`);

  //Start voting
  const votingStarted = await voteContract.startVoting();
  // Check if voting has started
  console.log(`Voting started: ${votingStarted}`);

  // Admin balance
  console.log(await voteContract.balanceOf(addr1.address));
  // Token contract balance
  console.log(await voteContract.balanceOf(tokenAddress));


  /***** First voter ****/
  // Buy token
  // Balance before
  console.log("First Voter balance before token purchase");
  console.log(await voteContract.balanceOf(addr1.address));
  await voteContract.connect(addr1).buyToken({value: 10 * ONE_GWEI});
  // Balance after
  console.log("First Voter balance after token purchase");
  console.log(await voteContract.balanceOf(addr1.address));

  //Vote
  await voteContract.connect(addr1).vote(_contenders);
  console.log("First Voter balance after voting");
  console.log(await voteContract.balanceOf(addr1.address));


  /***** Second voter ****/
  // Buy token
  // Balance before
  console.log("Second Voter balance before token purchase");
  console.log(await voteContract.balanceOf(addr2.address));
  await voteContract.connect(addr2).buyToken({value: 10 * ONE_GWEI});
  // Balance after
  console.log("Second Voter balance after token purchase");
  console.log(await voteContract.balanceOf(addr2.address));

  //Vote
  await voteContract.connect(addr2).vote(_contenders);
  console.log("Second Voter balance after voting");
  console.log(await voteContract.balanceOf(addr2.address));



  /***** Third voter ****/
  // Buy token
  // Balance before
  console.log("Third Voter balance before token purchase");
  console.log(await voteContract.balanceOf(addr3.address));
  await voteContract.connect(addr3).buyToken({value: 10 * ONE_GWEI});
  // Balance after
  console.log("Third Voter balance after token purchase");
  console.log(await voteContract.balanceOf(addr3.address));

  //Vote
  await voteContract.connect(addr3).vote(_contenders);
  console.log("Third Voter balance after voting");
  console.log(await voteContract.balanceOf(addr3.address));



  // End voting
  await voteContract.endVoting();



  // Get vote result
  const result = await voteContract.voteResult();

  // const res = await result.wait();

  console.log(await `The voting session has ended and the result is as follows: ${result.wait()}`);

  // Get vote winner
  const winner =  await voteContract.winner();
  console.log(`The winner for this round is ${winner}`);

  // Burn Tokens
  const contractBalance = await voteContract.balanceOf(voteContract.address);
  console.log(`The contract balance is ${contractBalance} before burning.`);

  await voteContract.burntoken(10);
  const contractBalanceAfter = await voteContract.balanceOf(voteContract.address);
  console.log(`The contract balance is ${contractBalanceAfter} after burning`);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
