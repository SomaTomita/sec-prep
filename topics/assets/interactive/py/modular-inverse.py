def extended_gcd(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
    return old_r, old_s


def mod_inverse(a, n):
    g, x = extended_gcd(a, n)
    if g != 1:
        return None
    return x % n
