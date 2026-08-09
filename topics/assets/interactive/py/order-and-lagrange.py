def element_order(a, p):
    a = a % p
    x = a
    k = 1
    while x != 1:
        x = (x * a) % p
        k += 1
    return k
