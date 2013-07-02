## What is it?

Socket.log is a [very] simple socket relay for console.log for use on legacy devices, often in obscure situations. The particular itch that needed scratching in this case was Android WebViews.

Note this was only ever built as a quick fix, so it's untested, etc etc.

## Installation

```
$ sudo npm install -g socketlog
```

## Support

_Should_ work on pretty much anything – will use WebSockets where available, and fall back to XMLHTTPRequest where it has to.

## Usage

1. Start the server:

	```
	$ socketlog
	```

2. Run a console window in a browser, go to [http://localhost:8088](http://localhost:8088), and open the JS console (CMD+ALT+J in Chrome).

3. Using the IP address accessible to the logging device, add the following script tag to the head of the page under test:

	```
	<script type="text/javascript" src="http://10.42.3.37:8088/console.js"></script>
	```

4. Let the logging fun commence.
