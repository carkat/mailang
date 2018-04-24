- booleanSymbols <- 'T F & V | -> <-> !<-> = != < <= >= > '
- mathSymbols    <- '+ - / * //'

- arraySymbols <- ';'

- dictSymbols  <- `

- function declartion symbol

- variable declaration symbol <-
- declare a variable
a         <- 5
b         <- 6
array     <- 1 2 3 4 5 6 a b
2dArr     <- 1 2 3 4 ; 5 6 a b
2dNestArr <- 1 (2 3) 4 ; 5 (6 a b)
dict      <- a`1 b`2 c`3 d ` 'string'
true      <- T
false     <- F
gt        <- 3 > 5
lt        <- 5 < 3
and       <- T & F
or        <- T V F

ifThenElse <-
  | T V F -> T
  | F

ifThenElseIfElse <-
  | 1 < 3 -> 3 + 1
  | 1 > 4 -> 4 * 16
  | 4 / 5 ** 3
   

- onlyIf works like true && true in other languages
- in javascript true && funct() means when true, do the thing to the right
- whereas onlyNot is akin to true || func in javascript
- do this only when the previous is not true
onlyIf    <-   T =  T <-> T

- XOR
onlyNot   <-   T = F !<-> T

equality  <-   a = b <->  F
nequality <-   a != b <->  T
typeEq    <-   a == b <->  T
typeEq2   <- 1.0 == 1 <->  F

multiLineArr <-
  1 2 3 4 5
  6 7 8 9 10 11 12
  13 14 15 

multiLineNestedArr <-
  1 2 3 4 (5 6 7 8)
  9 10 (11 12 (13 14))

multiLineNDNestedArr <-
 1 ; 2 3 4 5 (6 7) ;
 8 9 10 11 12 13 (14 (15 16))
 17 18 ; 19 20

multiLineDict <- 
  a ` 1 
  b ` 2 
  c ` 3 d ` 'string'
  f ` 4 g ` 5 h ` 6
  i ` 
    a ` multiLineArr
    b ` multiLineNDNestedArr
    c ` ...2dArr 1 2 3

isarr val = val == []
flattenIndex val = 
  | isarr val
  & find isarr val -> flattenIndex val
  | isarr val      -> ..val
  | val

fn a b = a + b

fn1 a b =
  | a = b -> a + b
  | b

factorial n = 
  | n > 1 -> n * factorial (n-1)   
  | n

where = ? 
bmiTell weight height =
  | bmi <= skinny -> "You're underweight, you emo, you!"  
  | bmi <= normal -> "You're supposedly normal. Pffft, I bet you're ugly!"  
  | bmi <= fat    -> "You're fat! Lose some weight, fatty!"  
  | otherwise     -> "You're a whale, congratulations!"  
  ? bmi    <- weight / height ^ 2  
    skinny <- 18.5  
    normal <- 25.0  
    fat    <- 30.0  

- similar to console.error(msg)
error msg = print msg 'error'

add a b = a + b

- basically ['str', 'str', 'str'].reduce((a,b) => a + b)
- reduces a string array into a single string value
- add_strArr
mergeStrArr strArr = reduce add strArr

map    fn arr = fn / arr
filter fn arr = fn | arr
reduce fn arr = fn _ arr
each   fn arr = fn ..arr

indOf  arr val = val @ arr
exists arr val = val ? arr

brackets <-
  all  ` '[]{}()'
  open ` '[{('
  close` ']})'
  }    ` '{'
  ]    ` '['
  )    ` '('
- []brackets only used to declare empty array
stack <- []

charIsBracket  char = exists brackets.all   char 
isOpenBracket  char = exists brackets.open  char 
isCloseBracket char = exists brackets.close char 

fmtStr str      = split str '' -> join _ '' -> filter charIsBracket -> split _ '' 
match str stack = each stack -> compare str


- the type inside () is a space separated array
- arrays are declared simply as space separated values
compare char stack = 
  | isOpenBracket char         -> push stack char
  | isCloseBracket char
  & doesntMatchTopOfStack char -> (mergeStr ('Found ' char ', but no opening bracket ' brackets char ' found')) -> error
  | pop stack

checkBalancedBrackets str = fmtStr str -> match _ stack

start <- checkBalancedBrackets '
function abcd() {
  if(true){
    const str = }
    const arr = []
  }
}
'
  
