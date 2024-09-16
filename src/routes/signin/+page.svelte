<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
	/* 	   async function handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement;
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form)
      });
  
     if (response.ok) {
        // Redirect to the dashboard or another protected route
        window.location.href = '../';
      } else {
        // Handle login error
        const data = await response.json();
        error = data.message;
      }
  }  */
</script>

<form method="POST" action="?/login">
	<div>
		<label for="username">Username</label>
		<input id="username" name="username" type="username" required />
	</div>
	<div>
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required />
	</div>
	<div>
		<button type="submit">Login</button>
	</div>

	<p>{form?.body.error}</p>
</form>
<a href="/signup">Register</a>
