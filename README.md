# Cum Online
A web version of the hit game [cum game](https://github.com/mativ123/cum-game)

# Roadmap
```mermaid
graph TD;
    subgraph done
        start(demo with user login and minimal gameplay)
    end
    start-->save(adding a 'save' feature that allows users to save progress)
    save-->leaderboard(a leaderboard where users can compare their progress with others)

    subgraph aside
        server(getting it set up on a server and getting a domain)
        server --- game(better gameplay)
    end
        
```
