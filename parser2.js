
const code =
  `
  - a comment
  myVar <- 5
  abcd  <- 6
  nums  <- 1 2 3 3 4 5
  obj   <- one\`1 two\`2 three\`3 four\`4 myVar
  str   <- 'hello world'

  fna a   = a * myVar
  fnb _   = print str

  add a b = a + b
  add5    = add 5
  mul a b = a * b
  
  newFn a b = a + b
  fn1 a b   = 
   | a == b -> a
   | b
  

  fn2 a b = newFn a b -> fn1 a
  fn3 a b = 
    | fn1 a b > 1 -> 0
    | 1

   e~!@#$%^&*()_+=-\`,./<>?;':"[]\\{}|'
  fn' a b = 
     a + b
  a fn b 
  what = fn2 a b -> _ \fn 5
    
  result <- 
    fn1 myVar abcd -> newFn str

  intList =
    1 2 3
    4 5 6
    7 8 9 10

  object =
      a\`a b\`b
      c\`c

  map    fn arr = fn / arr
  where  fn arr = fn | arr
  reduce fn arr = fn _ arr
  find   fn arr = fn ? arr
  indOf  fn arr = fn @ arr
  each   fn arr = fn ..arr

  len arr   = #arr

  range n m interval = 
    | interval -> map (mul interval) range n m
    |        m -> n!m 
    |       !n

  keys dict = ..dict\`
  vals dict = ..\`dict
  kvs  dict = ..dict\`dict
  spread ad = ...ad


  gtFive a = a > 5

  addFiveWhereGtFiveAndReduce = 
    where gtFive intList 
    -> map add5 
    -> reduce add

  anotherWay = add _add5 /gtFive |intList
  yetAnother = intList |gtFive /add5 _add
  `