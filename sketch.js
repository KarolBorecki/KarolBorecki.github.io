<html>
  <head>
  </head>
  <body>
    <div id="game-container">
      <div id="game">
        <script src="p5.min.js"></script>
        <script src="sketch.js"></script>
      </div>
    </div>
  </body>

  <style>
    body {
      background-color: black;
    }
    @media only screen and (max-width: 600px) {
      #game-container {
        width: 100vw;
        height: 68vw;
      }
    }
    #game-container {
      display: flex;
      width: 80vw;
      height: 50vw;
      margin: 0 auto;
      background-color: red;
    }

    #game {
      box-sizing: border-box;
      width: 95%;
      height: 95%;
      margin: auto;
      background-color: green;
    }
  </style>
</html>
