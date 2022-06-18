const savedFollowers = [
  {
    username: "bob",
  },
  {
    username: "mike",
  },
  {
    username: "jeff",
  },
  {
    username: "jack",
  },
];

const currentFollowers = [
  {
    username: "mike",
  },
  {
    username: "jeff",
  },
  {
    username: "jack",
  },
  {
    username: "william",
  },
];

const newUnfollowers = currentFollowers.filter(
  (current) =>
    !savedFollowers.some((saved) => saved.username == current.username)
);

const newFollowers = savedFollowers.filter(
  (saved) =>
    !currentFollowers.some((current) => saved.username == current.username)
);
console.log(newUnfollowers);
console.log(newFollowers);
