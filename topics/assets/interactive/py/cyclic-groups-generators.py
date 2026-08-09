def powers_mod(g, p):
    values = []
    x = g % p
    for _ in range(p - 1):
        values.append(x)
        x = (x * g) % p
    return values
