# IMDB Data 

Original data from
1. [imdb-extensive-dataset](https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset)
2. [48k-imdb-movies-with-posters](https://www.kaggle.com/rezaunderfit/48k-imdb-movies-with-posters)

after merge 2 dataset, it contains ~30K movies and ~110K movies principal name

# Generate data

```sh
yarn
bash ./transform.sh
```

it will produce single json contain all movies and principal name