def mod_pow_naive(a, exponent, m):
    result = 1
    for _ in range(exponent):
        result = (result * a) % m
    return result
