import express from 'express';
import fs from 'fs/promises';

const app = express();

let html = `
	<html>
		<head>
			<title>SWN Test</title>
		</head>
		<body>
			<h1>HELLO STUWARD</h1>
			<div>
				<img src='hello.png' />
			</div>
		</body>

		<script>
			if('serviceWorker' in navigator){
				navigator.serviceWorker.register('/main.js').then((registration)=>{
					let { active, installing } = registration;

					console.log('Registration',registration);
					if(installing){
						console.log("Registration is installing");
					}
					else if(active){
						console.log("Registration is active");
					}
				})
			}
			else{
				alert("Service worker not supported in this browser");
			}
		</script>
	</html>
`

console.log("UTH",process.cwd())

app.use(express.static(process.cwd() + '/img'))
app.use('/src',express.static(process.cwd() + '/../src'))

app.get('/index.js',async (req,res)=>{
	let data = (await fs.readFile('../index.js')).toString();

	res.set('content-type','text/javascript');
	res.end(data);
})

app.get('/main.js',async (req,res)=>{
	let data = (await fs.readFile('../main.js')).toString();

	res.set('content-type','text/javascript');
	res.end(data);
})

app.get('/',(req,res)=>{
	res.set('content-type','text/html');

	res.end(html);
})

app.listen(80)