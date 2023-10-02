// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon{
    //example
    // string public name;

    //declaring owner here
    address public owner;
    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    struct Order{
        uint256 time;
        Item item;
    }

    mapping(uint256=>Item) public items;

    //Buying Mapping
    //Customer who placed the order his address will come here and how order he placed here will come unit256 count
    mapping(address=>uint256) public OrderCount;
    //User address will get from here and nested mapping will give you orders count along with Order Struct which we have declared above, so finally it will give us how many orders are holded by the user
    mapping(address=>mapping(uint256=>Order)) public orders;


    constructor(){
        // name="Dappazon";
        owner=msg.sender;
    }
    event List(string indexed name,uint256 cost,uint256 quantity);
    event Buy(address indexed buyer,uint256 indexed orderId,uint256 indexed ItemId);
    //only Owner has to call the List fn to listout the priducts
    modifier onlyOwner(){
        require(msg.sender==owner,"Only Owner Can Add");
        _;
    }
    //List Products

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock) public onlyOwner{
        //Create Item Struct
        Item memory item=Item(_id,_name,_category,_image,_cost,_rating,_stock);
        //Save item struct into block chain
        items[_id]=item;
        //emit an event
        emit List(_name,_cost,_stock);
    }
    //BUY PRODUCTS
    function buy(uint256 _id) public payable{
        //Recieve Amount(Crypto) by using payable we can recive amount
        //Fetch Item based on ID from block chain
        Item memory item=items[_id]; //items means its a mapping for Item Struct check the above
        //require enough ethers to buy a item
        require(msg.value>=item.cost,"Insuffiecinet Funds..");
        //Require Item in Stock
        require(item.stock >0);
        //Create An Order
        Order memory order=Order(block.timestamp,item);
        //Add order for an user
        OrderCount[msg.sender]++;
        orders[msg.sender][OrderCount[msg.sender]]=order;
        //Substract the Stcok number
        items[_id].stock=item.stock-1;
         //Emit an event
         emit Buy(msg.sender,OrderCount[msg.sender],item.id);
    }
    //Withdraw Funds

    function withdraw() public onlyOwner{
        (bool success,)=owner.call{value:address(this).balance}("");
        require(success,"There no funds in SC to Withdraw");
    }
}

