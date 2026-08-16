def gf2_poly_mul(a, b):
    result = 0
    while b:
        if b & 1:
            result ^= a
        a <<= 1
        b >>= 1
    return result


def gf4_mul(a, b):
    product = gf2_poly_mul(a, b)
    if product & 0b100:
        product ^= 0b111
    return product
