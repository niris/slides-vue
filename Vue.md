# Install
Vue is a single .js file (like Jquery)
- import from CDN `<script src=...>`
- import in JS module `import "...";`

# First page
- Create a `<main>` tag (just an example)
- Create your first Vue with `new Vue` with `el:'main'`
- use `{{1+2}}` to check if Vue is working in your el

# Data

- declare a list: `posts`:
```js
const app = new Vue({
	el:'main',
	data:{posts:[]}
})
```
- use it on your page: `{{posts}}`

# v-if

We display a message if no posts
```html
<b v-if="posts.length==0">No posts !</b>
```

# v-for

Now we want the list
```html
<ul>
	<li v-for="post in posts">{{post}}</li>
</ul>
```

Add fake value in `data:{posts:[...]}`

# v-bind:attr=data
- will keep `data => HTML` synchronized
- add a `blocked:true` in your data
```html
<textarea v-bind:disabled=blocked></textarea>
```
- update from F12 the value: `app.blocked=false`

# v-on:event=method

Catch HTML => JS events 
- Create a `getPosts()` in your app `methods`:
```js
{
	methods:{
		getPosts() { // this == app
			this.data.posts=['you clicked']// TODO: use fetch
		}
	}
}
```
```html
<button v-on:click.prevent=getPosts()></button>
```

# v-model=data

Keep synchronized HTML <=> JS (double binding)

```js
{data:{message:'', ...etc}}
```

```html
<textarea v-bind:disabled=blocked v-model="message"></textarea>
<button>send {{message}}</button>
```

# Components:

Let's split our apps in 2 smaller components :

```js
const PostForm = {
	methods: {
		sendPost(form) {
			//TODO:fetch(method:POST,body...)
			this.$emit('send')
		}
	},
	template: `
	<form v-on:submit.prevent=sendPost($event.target)>
		<textarea name=message></textarea>
		<button>send post</button>
	</form>
`
};
```

```js
const PostList = {
	data() {
		return { posts: [] };
	},
	methods: {
		getPosts() {
			this.posts = [{ message: `mounted at ${+new Date()}`}]
		},
	},
	mounted() { this.getPosts() },
	template: `
	<ul>
		<li v-for="post in posts">{{post}}</li>
	</ul>
	`
};
```

```html
<main>
	<post-form></post-form>
	<post-list></post-list>
</main>
<script>
const app = new Vue({
	el:'main',
	components:{PostList,PostForm}
})
</script>
```

# Components relation
when submited, `post-form` will refresh the `post-list`.
```js
this.$emit('send')
```

# Vue-Router

```html
<!DOCTYPE html> <!-- Page Example -->
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-router"></script>
<main>
 <nav>
  <router-link :to="'/'">Home</router-link>
  <router-link :to="'user'">User</router-link>
  <router-link :to="'xxx'">xxx</router-link>
 </nav>
 <router-view />
</main>
<script>
HomePage={template:`<h1>Welcome !</h1>`}
UserPage={template:`<b>User info:</b>`}
E404Page={template:`<pre>Woups</pre>`}
let routes = [
  { path: '/',     component: HomePage},
  { path: '/user', component: UserPage},
  { path: '*',     component: E404Page},
]; // mode = "history"
let router = new VueRouter({routes})
let app = new Vue( {el: 'main', router})
</script>
```
