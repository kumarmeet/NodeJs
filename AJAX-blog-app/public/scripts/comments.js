
const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");

const formData = {
  commentTitle: document.getElementById("title"),
  commentText: document.getElementById("text"),
};

function createCommentsList(comments) {
  const createListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p> ${comment.text}</p>
    </article>
`;
    createListElement.appendChild(commentElement);
  }

  return createListElement;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsBtnElement.dataset.postid;
  const response = await fetch(`/posts/${postId}/comments`);

  try {
    if (!response.ok) {
      alert("Fetching comments failed!");
      return;
    }
    const responseData = await response.json();

    if (responseData && responseData.length > 0) {
      const commentListElement = createCommentsList(responseData);
      commentSectionElement.innerHTML = "";
      commentSectionElement.appendChild(commentListElement);
    } else {
      commentSectionElement.firstElementChild.textContent =
        "We could not find any comments. May be add one?";
    }
  } catch (error) {
    alert("Getting comments failed!");
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;
  const enteredTitle = formData.commentTitle.value;
  const enteredText = formData.commentText.value;

  const comment = {
    title: enteredTitle,
    text: enteredText,
  };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
    } else {
      alert("Could not sent comment!");
    }
  } catch (error) {
    alert("Could not send request due to technical reasons!");
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);

commentsFormElement.addEventListener("submit", saveComment);
