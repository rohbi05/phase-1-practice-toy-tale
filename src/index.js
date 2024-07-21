const toys = 'http://localhost:3000/toys';
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Function to fetch Andy's toys and add them to the DOM
  function fetchAndRenderToys() {
    fetch(toys)
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const toyCard = createToyCard(toy);
          document.getElementById("toy-collection").appendChild(toyCard);
        });
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = toy.name;

    const image = document.createElement("img");
    image.classList.add("toy-avatar");
    image.src = toy.image;

    const likes = document.createElement("p");
    likes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.dataset.id = toy.id;
    likeButton.textContent = "Like ❤️";
    likeButton.addEventListener("click", handleLikeButtonClick);

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(likes);
    card.appendChild(likeButton);

    return card;
  }

  // Function to handle form submission for adding a new toy
  function handleToyFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newToy = {
      name: formData.get("name"),
      image: formData.get("image"),
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(() => {
        const toyCard = createToyCard(newToy);
        document.getElementById("toy-collection").appendChild(toyCard);
      })
      .catch(error => console.error("Error adding new toy:", error));
  }

  // Function to handle like button click for a toy
  function handleLikeButtonClick(event) {
    const toyId = event.target.dataset.id;

    fetch(`${toys}/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(event.target.previousElementSibling.textContent) + 1
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        event.target.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating toy likes:", error));
  }

  document.querySelector(".add-toy-form").addEventListener("submit", handleToyFormSubmit);

  fetchAndRenderToys();
});