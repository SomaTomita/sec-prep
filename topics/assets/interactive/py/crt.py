def crt(remainders, moduli):
    M = 1
    for m in moduli:
        M *= m
    x = 0
    for a, m in zip(remainders, moduli):
        Mi = M // m
        yi = pow(Mi, -1, m)
        x += a * Mi * yi
    return x % M
