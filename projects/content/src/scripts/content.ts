Promise.all([
  import('./load-app'),
  import ('./background-listener')]
).then()
