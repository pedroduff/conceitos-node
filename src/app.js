const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error: `Invalid repository ID`});
  }

  return next();
}

function validatePost(request, response, next){
  const { title, url, techs } = request.body;

  if(!title){
    return response.status(400).json({error: `Need title to proced`});
  }

  if(!url){
    return response.status(400).json({error: `Need url to proced`});
  }

  if(!techs){
    return response.status(400).json({error: `Need techs to proced`});
  }

  return next();
}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validatePost, (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: `Repository not found` })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: `Repository not found` })
  }

  repositories[repositoryIndex].likes ++;

  return response.json(repositories[repositoryIndex]);
  
});

module.exports = app;
