const rotate = (num, arr,n=num%arr.length) => 
  arr.map((x, i, a) => {
    const j = i + n < a.length
      ? i + n
      : (i - a.length) + n

      return j < a.length
        ? a[j] 
        : a[0]
  })