const PostForm = {
  methods: {
    sendPost(form) {
      fetch("/post", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      }).then(res => res.ok ? this.$emit('send') : alert('woops'));
    }
  },
  template: `
<form v-on:submit.prevent=sendPost($event.target)>
  <textarea name=message placeholder="What's in your mind"></textarea>
  <div class="row">
    <select class=col disabled><option>Public</option></select>
    <button class="col-3 button primary">send post</button>
  </div>
</form>
`
};
const PostList = {
  data() {
    return { posts: [] };
  },
  methods: {
    getPosts() {
      fetch("/post?select=*,comment(*)")
      .then(r => r.json())
      .then(r => this.posts = r.reverse());
    },
    deletePost(post_id){
      fetch("/post/"+post_id, {method:'DELETE'})
      .then(res => this.getPosts())
    },
    getComment(post_id, post){
      fetch("/comment?post_id=eq."+post_id)
      .then(res=>res.json())
      .then(comment => post.comment = comment)
    },
    deleteComment(comment_id, post){
      fetch("/comment/"+comment_id, {method:'DELETE'})
      .then(res => this.getComment(post.id, post))
    },
    sendComment(form, post){
      fetch("/comment", {
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      }).then(() => form.reset(this.getComment(form.post_id.value, post)));
    }
  },
  mounted() { this.getPosts(); },
  template: `
<div>
  <h1 v-if="!posts.length" class="text-light text-center">No post !</h1>
  <div class="card post" v-for="post in posts">
    <details>
      <summary>{{post.message}} ({{post.comment.length}})</summary>
      <div class="comment" v-for="comment in post.comment">
        <a class="button error" v-on:click="deleteComment(comment.id, post)">🗑️</a> {{comment.message}}
      </div>
    </details>
    <form class="row" v-on:submit.prevent="sendComment($event.target, post)">
      <input class="col" name="message">
      <input type="hidden" name="post_id" v-bind:value="post.id">
      <button class="col-3">Comment</button>
      <button class="col-2 button error" v-on:click.prevent="deletePost(post.id)">🗑</button>
    </form>
</div>
</div>
`
};

export default {
  template: `
  <article>
    <h1>Hello Anonymous!</h1>
    <post-form v-on:send=refresh></post-form>
    <post-list ref=list></post-list>
  </article>
  `,
  methods: {
    refresh(ev) {
      this.$refs.list.getPosts();
    }
  },
  components: { PostList, PostForm }
};
