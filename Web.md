# How-to Create anonymous Facebook-like website : AnoniFace

- Understand client-server HTTP/HTML/
- Use Javascript, then Vue.js
- Extra: 
	- Authentication
	- Websocket
	- ES6 modules
	- CSS3 features (Grid / Flexbox)

> Windows: please install `curl`

---

# Web Architecture
Web is a **Client-Server** Architecture.

```
           1) Request (using URL)
┌────────────┐ ──────> ┌───────────────┐
│ Web Client │         │  Web Server   │
│ Ex:Chrome  │         │ Ex:reru.ac.th │
└────────────┘ <────── └───────────────┘
           2) Response (page, image...)
```

In this course we will create the AnoniFace website (client+server)

- Client <details><summary>show data </summary>
```py
post={message, date}
comment={post_id, message, date}
```
</details>
- Server <details><summary>serve data </summary></details>

> What do you want first ? Client or Server ? Why ?

Let's see how client access server ...

---

# URI: Uniform Resource Identifier

- Book: `isbn:0-345-24223-8`
- Phone: `tel:+33618445370`
- BitTorrent: `magnet:?xt=urn:btih:f995de9d`

URL = URI + Location

- `mailto:remy@domain.com`
- `http://google.com`
- `https://cs.reru.ac.th/teachers/sirin`
- `https://lazada.com/phone?brand=apple&order=price`

URL Format:
```
scheme://[user@]host[:port]/path[?query][#fragment]
```

---

# HTTP Request Example

```
┌───────────┐ Request ┌───────────────┐
│  Client   │ ──────> │     Server    │
└───────────┘         └───────────────┘
```

Accessing https://reru.ac.th/robots.txt will send:

```http
GET /robot.txt HTTP/1.1
Host: reru.ac.th
User-agent: Linux Chrome/87
```
Wish use this format:
```http
METHOD /path/to/file HTTP/...
Header: value
Header: value

data (optional)
```

---

# HTTP Response Example

```
┌───────────┐          ┌───────────────┐
│  Client   │ <─────── │     Server    │
└───────────┘ Response └───────────────┘
```
... and the RERU server will respond with:
```http
HTTP/1.1 200 OK
Content-Type: text/plain

Hello !
```

```http
HTTP/... CODE STATUS
Header: Value

data
```

> DEMO: `nc 202.29.53.6 80` + speedrun W10 install !

---

# API


- HTTP is just a **protocol** for serving our data.
- The way of organizing it, is called API (Application Programming Interface).
- They are different types of API: [SOAP](https://www.tutorialspoint.com/soap/soap_examples.htm), RPC, REST...

For examples:
- https://api.deezer.com/artist/1 (REST)
- https://cs.reru.ac.th/teachers/sirin (REST)
- https://api.coingecko.com/api/v3/coins/ethereum  (REST)
- https://www.metaweather.com/api/location/1225448/  (REST)
- https://api-jooxtt.sanook.com/openjoox/v3/search_hint?keyword=gorillaz (?)
- http://www.learnwebservices.com/services/hello?WSDL (WSDL)
- https://documenter.getpostman.com/view/8854915/Szf26WHn?version=latest

> I'm using a CLI tools curl/nc , GUI tools exists (Postman, Insomnia)

---

# Break: Download Joox MP3 :
- curl https://api-jooxtt.sanook.com/openjoox/v3/search_hint?keyword=major+lazer
- curl 'https://api-jooxtt.sanook.com/page/artistDetail?id=RB%2BGOOMxMA7wGPRz5hj2Nw%3D%3D&lang=th&country=th' | jq .artistTracks.tracks.items[].id
- http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=Q0VWMFLNJ3V2DUeZBBiUEg%3D%3D
- http://stream.music.joox.com/C1000015sCDO47xKwc.m4a?fromtag=38

> What does AnoniFace API shall serve/look like ?
---
# AnoniFace API

We'll create a REST API (simple and modern):

- `GET /comment/` GET all comment
- `GET /comment/1` GET the comment with id=1
- `GET /comment?post_id=1` GET all comments for the post#1
- `DELETE /comment/1` delete the comment with id=1
- create a new comment:

```http
POST /comment/ HTTP/1.1
Content-Type: application/json

{"post_id":1, "message":"Hello Anonibook !"}
```

- edit a comment :

```http
PUT /comment/1 HTTP/1.1
Content-Type: application/json

{"message":"Woups I edited again"}
```

---
# XAMP Stack (LAMP/WAMP)

```
    ┌────────┐
    │ Client │
    └────────┘
        | GET /user.php?id=tom
┌────────────────┐
│ ┌────[80]────┐ │
│ │   Apache   │ │ // Serve files or forward to PHP
│ └────────────┘ │
│       |        │ GET /user.php?id=tom
│ ┌────────────┐ │
│ │  user.php  │ │ // fetch+return from database
│ └────────────┘ │
│       |        │ SELECT * FROM USER WHERE ID = 'tom'
│ ┌───[3306]───┐ │
│ │    MySQL   │ │ // most popular DB for beginner
│ └────────────┘ │
└────────────────┘
```
---
# MEAN Stack

```
   ┌─────────┐
   │ Angular │ // The client run Angular
   └─────────┘
        | GET /user.php?id=tom
┌────────────────┐
│ ┌────[80]────┐ │
│ │   Nginx    │ │ // Serve files or forward to Express
│ └────────────┘ │
│       |        │ GET /user.php?id=tom
│ ┌────────────┐ │
│ │ Express.js │ │ // fetch+return from database
│ └────────────┘ │
│       |        │ SELECT * FROM USER WHERE ID = 'tom'
│ ┌───[3306]───┐ │
│ │   MongoDB  │ │ // document database
│ └────────────┘ │
└────────────────┘
```
---

# AnoniFace Stack

```
    ┌────────┐
    │ Client │ // Vue
    └────────┘
        | GET /user/tom
┌────────────────┐
│ ┌────[80]────┐ │
│ │    Nginx   │ │ // Serve files or forward
│ └────────────┘ │
│       |        │ GET /user/tom
│ ┌───[3000]───┐ │
│ │ PostgREST  │ │ // Convert REST URI into PostgreSQL
│ └────────────┘ │
│       |        │ SELECT * FROM USER WHERE ID = 'tom'
│ ┌───[5432]───┐ │
│ │ PostgreSQL │ │ // the best database in the world
│ └────────────┘ │
└────────────────┘
```

I used PHP, Express, Flask, Django, Spring ... And I'm tired ...
So now I use PostgREST to automatically offer a REST API Server from a PostgreSQL database.

---
# AnoniFace database

The only code we will need for our backend (thanks to PostgREST):

```sql
--DROP TABLE IF EXISTS post;
CREATE TABLE post(
	id      SERIAL PRIMARY KEY,
	created_at timestamp default CURRENT_TIMESTAMP,
	message TEXT);
--DROP TABLE IF EXISTS comment;
CREATE TABLE comment(
	id      SERIAL PRIMARY KEY,
	post_id SERIAL not null,
	created_at timestamp default CURRENT_TIMESTAMP,
	message TEXT,

	CONSTRAINT fk_post FOREIGN KEY(post_id)
		REFERENCES post(id) 
		ON DELETE CASCADE);
```

---

# Start the Stack

> On windows: Install everything manually (or use WSL/WSL2)

I'm using docker to run the 3 services (Nginx/Postgres/PostgREST) because I don't want to install them on my machine:
```bash
docker-compose up -d
```

Docker is like a lightweight virtual machine on Linux.

Then I send the SQL in database:
```bash
docker ps
docker exec -i *_postgres_1 psql app_db app_user < *.sql
```

---

# Client/Frontend : Display page

```
┌───────────┐
│  Client   │ <──────  HTML Page
└───────────┘
```
HTML Page example :

```html
<html lang="en">
	<body>
		<h1>Hello</h1>
	</body>
</html>
```

- Page = Element tree
- Element = name + attributes + childrens
- ~ 100 [standard](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) Element (`<img>`, `<video>`, `<a>`, `<form>`)

---

# The `<form>` HTML element
Send data to the server using HTTP request: Method+Path (action)

```html
<form method="get" action="http://0.0.0.0:3000/post">
	<button>all posts</button>
</form>
```

```html
<form method="get" action="http://0.0.0.0:3000/post">
	<input name="message" value="eq.hello">
	<button>search</button>
</form>
```

Will generate `GET /post?message=eq.hello`
> Note: the `eq.` part is just for PostgREST

---
# The `<form>` HTML element
```html
<form method="POST" action="http://0.0.0.0:3000/post">
	<input name="message">
	<button>post status</button>
</form>
```

Will generate:
```http
POST /post HTTP/1.0
Content-Type: application/x-www-form-urlencoded

message=hello
```

---

# listing API (JSON) in the page (HTML)

Javascript can handle/prevent form submit with `onsubmit`

```html
<form onsubmit="return confirm('really ?')">
	<button>test</button>
</form>
```

We need Javascript/ES6 magic !

---

# Javascript (ES6)

Javascript is an evolving language that follow the ECMA Script standard (European Computer Manufacturers Association) last=ES7

ES6 add many features wanted by developpers.
We will only see what we need for our website.

---

# ES6: `let` and `const` (no `var`)

```js
let x;
let x = "inner"; // error, already declared

const x = "sneaky";
x = "foo"; // error, const
```

---

# ES6: template strings

```js
const values = ['hello', 'world'];
const es5 = 'Hey! ' + values[0] + ' my ' + values[1] + '!';
const es6 = `Hey! ${values[0]} my ${values[1]} !`;
```

---

# ES6: Arrow Function

```js
function(a, b) { return a + b; }
// same as:
(a, b) => a + b
```

---

# ES6: argument

```js
function f(x, y=12, ...rest) {
  return x + y + rest.length;
}
const args = [1,2,3]
f(0,...args)
```

---

# ES6: destructuring

```js
let {name, age} = getUser() // {name:'tom',age:25}
let [a, , c=0, ...rest] = [1,2,3,4,5,6,7]
// in function:
function show(user) { // old style
  console.log(user.name, user.age);
}
function show({name="", age=0}) {
  console.log(name, age);
}
```

---

# ES5: .map() / .filter() / .reduce() ...

```js
const old  = [0,1,2,3,4]
old.map(function(x){return x*x}) // old style
old.map(x => x*x) // [0, 1, 4 ...]
old.reduce((all,x) => all+x, 0) // (0)+0+1+2+3+4 = 10
old.filter(x => x>3) // [4]
old.map(x => x*x).filter(x => x>3) // [4, 9, 16]
old.forEach(x => console.log(x)) // no return value
```

> quizz time !

---

# ES6: Promises

JS run in a single thread but use en event-loop to handle asynchronous action.

> asynchronous = execute multiple functions without waiting each other

Temporary Object that will give you a result... sometime.

```js
const url = 'https://api.nationalize.io?name=rémy';
// fetch() return a Promise object
fetch(url).then( // with a .then(ok,ko) method
	resp => console.log(resp.status), // 200, 404
	fail => console.error // bad domain/network
);
// nested promises (body + parsing)
fetch(url).then(resp => {
  resp.json().then(obj => {
    console.log(obj.country[0].country_id)
  })
});
// using ES6 await instead of .then()
// /!\ require an async context /!\
res = await fetch(url);
obj = await res.json();
// await one-line
data = await (await fetch(url)).json()
console.log(data.country[0].country_id)
```

---

# Search result with text()

We convert the `<form>` values into URI query (`?name=value&etc=bla`)
```html
<form action="http://0.0.0.0:3000/status"
 onsubmit="let q=new URLSearchParams(new FormData(this));
           fetch(action+'?'+q)
           .then(res=>res.text())
           .then(txt=>out.value=txt);
           return false">
	<input name="message" value="eq.hello">
	<button>search</button>
	<output name="out"></output>
</form>
```

---

# Search result with json()+html
Do not use at home
```html
<form action="http://0.0.0.0:3000/status"
 onsubmit="let q=new URLSearchParams(new FormData(this));
           fetch(action+'?'+q)
           .then(res=>res.json())
           .then(obj=>out.value=obj.map(o=>
             '<li>'+o.message+'</li>'
           )); return false">
	<input name="message" value="eq.hello">
	<button>search</button>
	<output name="out"></output>
</form>
```

Doing manual HTML is dangerous (Injection) !

---
# Vue example
```html
<form v-on:submit.prevent="search($event.target)">
	<input name="message" value="eq.hello">
	<input type="submit" value="search">
	<ul><li v-for="r in results">{{r.message}}</li></ul>
</form>
<script type=module>
import "https://unpkg.com/vue";
new Vue({
	el:'form',
	data:{results:[]},
	methods:{
		async search(form){
			let q = new URLSearchParams(new FormData(form));
			let resp = await fetch('http://0.0.0.0:3000/status?'+q);
			this.results = await resp.json();
		}
	}
})
</script>
```

Introducing ... Javascript Frameworks (Angular, React Vue)

---

# Web in 2005:
```
┌────────────┐
│ Web Client │
└────────────┘
       │
       │ HTML Page with data
       │
┌──[old.com]──┐
│    Apache   │
├─────────────┤
│     PHP     │
├─────────────┤
│    MySQL    │
└─────────────┘
```
PHP generate HTML page with mixed data => HTML only

> Then, mobile native app (Android/iOS) need JSON !
---

# Web in 2015:
```
┌────┬─────┬─────────┬───────┐
│ TV │ iOS │ Android │  Web  │
└────┴─────┴─────────┴───────┘
   └────┼─────┘        ││
  JSON  │   ┌──────────┘│
REST API│   │           │
        ▼   ▼           ▼ files
┌[api.site.fr]┐┌[www.site.fr]┐
│php/py/rb/jar││    NGINX    │
├─────────────┤│ - vue.js    │
│    mySQL    ││ - index.html│
└─────────────┘└─────────────┘
```

- Mobile Apps force us to create a JSON API (web+mobile)
- Web Browsers are powerfull (ES6!) to also use it:
	- fetch data from api + display in page
	- All website page are now in HTML+JS only => big code
---

# Javascript frameworks

Frameworks help you organise your code.
Help other dev to understand your code.
> Javascript frameworks organise your code by creating **custom components**.

```html
<main>
	<top-menu></top-menu>
	<side-menu></side-menu>
	<article>
		<google-map lat="42.5" lng="15.5"></google-map>
		<youtube-video v="qvUWA45GOMg"><youtube-video>
		<joox-song id="654897321"></joox-song>
	</article>
<main>
```
---
# Javascript frameworks
Most used JS frameworks in [2020](https://imgur.com/AvZBRQV.png)
[![](https://i.imgur.com/qYgz7S6.png)](https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190)
- Want to learn [Angular](https://github.com/angular/angular) (766K) ? need TS (+ npm + ...)
- Want to learn [React](https://github.com/facebook/react ) (133K) ? need JSX (+ npm + ...) 
- Want to learn [Vue](https://github.com/vuejs/vue) (58K) ? **don't need anything !**
---
# Vue.js

See: https://niris.github.io/slides-web/#13

---

# Authentication

- Client log-in (user+password) to Server.
- Server generate a token for this client.
- Client use it in it requests.
> How to generate a token ?
- `token` = `data` + `signature`
- data = `{"name":"admin", "rights":["r","w"]}`
- signature = SHA256(`5ECR3T`+data)

---
# CSS display:grid

https://css-tricks.com/snippets/css/complete-guide-grid/

---

# CSS display:flex

https://css-tricks.com/snippets/css/a-guide-to-flexbox/

---
