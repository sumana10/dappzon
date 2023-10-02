const { expect } = require("chai");
const { ethers } = require("hardhat");
 const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }
const ID=1;
const NAME="Shoes";
const CATEGORY="Clothing";
const IMAGE="https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST=tokens(1);
const RATING=4;
const STOCK=5;
 describe("Dappazon",()=>{
    let dappazon;
    let deployer;
    let buyer;
    beforeEach(async()=>{
        //setup accouonts
        // console.log(await ethers.getSigners())
        [deployer,buyer]=await ethers.getSigners();
        // console.log(deployer.address,buyer.address)
        //Deploying
        const dap= await ethers.getContractFactory("Dappazon");
        dappazon= await dap.deploy();
    })

    describe("Deployemnt",async()=>{
        // For Testing Purpose
        //it("has a name",async ()=>{
        //     expect(await dappazon.name()).to.equal("Dappazon");
        // })
        it("Set the Owner",async()=>{
            expect(await dappazon.owner()).to.equal(deployer.address)
        })        
    })

    describe("Listing",async()=>{
        let transaction;
       
        beforeEach(async()=>{
            transaction=await dappazon.connect(deployer).list(
                ID,NAME,CATEGORY,IMAGE,COST,RATING,STOCK
            )
            //we fetching the data from block chain right so we need to wait()
            await transaction.wait();
        });
        it("Returns Item attributes",async()=>{
            const item = await dappazon.items(ID);
            expect(item.id,item.name).to.equal(ID,NAME);
         })
         it("Emit List Event",async()=>{
            expect(transaction).to.emit(dappazon,'List');
         })
        
    })

    describe("Buying",async()=>{
        let transaction;
        beforeEach(async()=>{
            //List an item
            transaction=await dappazon.connect(deployer).list(ID,NAME,CATEGORY,IMAGE,COST,RATING,STOCK);
            await transaction.wait();
            //Buy an Item
            transaction=await dappazon.connect(buyer).buy(ID,{value:COST});
            await transaction.wait();
        });
        it("Update the contract Balance",async()=>{
            const result=await ethers.provider.getBalance(dappazon.target);
            // console.log(result,COST)
            expect(result).to.equal(COST);
        })
        it("Update's Buyer Order Count",async()=>{
            const result=await dappazon.OrderCount(buyer.address);
            // console.log(result);
            expect(result).to.equal(1);
        });
        it("Adds the Order",async()=>{
            //here order means mappping of Orders struct interlink conncection
            const order=await dappazon.orders(buyer.address,1);
            console.log(order.time,order.item.name);
            expect(order.time).to.be.greaterThan(0);
            expect(order.item.name).to.equal(NAME);
        });

        it("Emits Buy Event",async()=>{
            expect(transaction).to.emit(dappazon,"Buy");
        })

        it("Checking Buyer having Suffiecients funds or not",async()=>{
            const fund=await ethers.provider.getBalance(buyer);
            expect(fund).to.be.greaterThan(COST);
        })

        it("Checking Items are in Stock or not",async()=>{
            const itemsStock=await dappazon.items(ID);
            expect(itemsStock.stock).to.be.greaterThan(3);
        })
    })

    describe('Withdraw',async()=>{
        let transaction;
        let beforeBalance;
        beforeEach(async()=>{
            transaction=await dappazon.connect(deployer).list(ID,NAME,CATEGORY,IMAGE,COST,RATING,STOCK);
            await transaction.wait();

            //if we want to add funds to smart contract first of all we need to buy the item
            transaction=await dappazon.connect(buyer).buy(ID,{value:COST});
            await transaction.wait();

            //get Deployer Balance Before Buy
            beforeBalance=await ethers.provider.getBalance(deployer);

            //withdraw funds
            transaction=await dappazon.connect(deployer).withdraw();
            await transaction.wait();
        })

        it("Updates the owner Balance",async()=>{
            const balaceAfter=await ethers.provider.getBalance(deployer);
            expect(balaceAfter).to.be.greaterThan(beforeBalance);
        });
        it("Updates the Contract balance",async()=>{
            const Contractbal=await ethers.provider.getBalance(dappazon.target);
            expect(Contractbal).to.equal(0);
        })
    })
})
