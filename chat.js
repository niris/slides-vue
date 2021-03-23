export default {
  template:`<article>
<form v-on:submit.prevent="ws.send($event.target.stdin.value)">
  <div class="row">
    <input class="col" name="url" value="ws://10.3.81.176:8080/">
    <input class="col-2" type="button" value=connect v-on:click="ws=connect($event.target.form.url.value)">
  </div>
  <output>{{stdout}}</output>
  <div v-if=ws>
    <input name="stdin" placeholder="stdin">
    <input type="submit" value="send">
    <input type=button value="clear" v-on:click="stdout=''">
  </div>
</form>
</article>
`,
  data(){return {ws:null, stdout:''}},
  methods:{
    connect(url){
      console.log(this);
      return Object.assign(new WebSocket(url), {
        onopen:()=>console.log(this.ws),
        onclose:()=>this.ws=null,
        onmessage:({data})=>this.stdout += `${data}\n`,
      })
    }
  }
}