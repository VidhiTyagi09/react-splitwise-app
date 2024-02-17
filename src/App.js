import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((currValue) => !currValue);
  }

  function HandleAddFriend(friend) {
    setFriends((currFriends) => [...currFriends, friend]);
    setShowAddFriend(false);
  }

  function HandleSelection(friend) {
    setSelectedFriend(friend);
  }

  function RemoveFriend(friend) {
    const newFriends = friends.filter((f) => f.id !== friend.id);
    setFriends(newFriends);
    setSelectedFriend(null);
  }

  function HandleSplitBill(moneyToGet) {
    const newFriends = friends.map((f) => {
      if (f.id === selectedFriend.id) {
        return { ...f, balance: f.balance + moneyToGet };
      }
      return f;
    });
    setFriends(newFriends);
    setSelectedFriend(null);
  }

  function RemoveSplitForm() {
    setSelectedFriend(null);
  }

  return (
    <>
      <h1>Splitwise</h1>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            HandleSelection={HandleSelection}
            RemoveFriend={RemoveFriend}
          />

          {showAddFriend && (
            <FormAddFriend
              friends={friends}
              HandleAddFriend={HandleAddFriend}
            />
          )}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selectedFriend !== null && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            HandleSplitBill={HandleSplitBill}
            RemoveSplitForm={RemoveSplitForm}
          />
        )}
      </div>
    </>
  );
}

function FriendList({ friends, HandleSelection, RemoveFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          HandleSelection={HandleSelection}
          RemoveFriend={RemoveFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, HandleSelection, RemoveFriend }) {
  let msg = `You and ${friend.name} are even`;
  const balance = friend.balance;
  if (balance < 0) {
    msg = `You owe ${balance * -1}₹ to ${friend.name}`;
  } else if (balance > 0) {
    msg = `${friend.name} owes You ${balance}₹`;
  }
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p className={`${balance > 0 ? "green" : balance < 0 ? "red" : ""}`}>
        {msg}
      </p>
      <Button onClick={() => HandleSelection(friend)}>Add Expense</Button>
      <h2 className="delete" onClick={() => RemoveFriend(friend)}>
        ❌
      </h2>
    </li>
  );
}

function Button({ children, onClick, className }) {
  return (
    <button className={className ? className : "button"} onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ friends, HandleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriendSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      id: crypto.randomUUID(),
      name,
      image: `${image}?u=${crypto.randomUUID()}`,
      balance: 0,
    };
    HandleAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriendSubmit}>
      <label>🧑‍🤝‍🧑 Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, HandleSplitBill, RemoveSplitForm }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [paying, setPaying] = useState("user");
  const friendExpense = bill - yourExpense;

  function AddYourExpense(expense) {
    if (expense > bill) {
      alert("Expense cannot be greater than bill");
      return;
    }
    setYourExpense(expense);
  }

  function HandleSubmit(e) {
    e.preventDefault();
    if (bill === "") {
      alert("Please enter your bill value");
      return;
    }
    const moneyToGet = paying === "user" ? friendExpense : -1 * yourExpense;
    HandleSplitBill(moneyToGet);
  }

  return (
    <form className="form-split-bill" onSubmit={HandleSubmit}>
      <h2> Split expense with {selectedFriend.name}</h2>

      <h2 className="removeSplitform" onClick={RemoveSplitForm}>
        ❌
      </h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🕴️ Your Expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => AddYourExpense(Number(e.target.value))}
        min={0}
        max={bill}
      />

      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
      <input type="text" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill</label>
      <select onChange={(e) => setPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
