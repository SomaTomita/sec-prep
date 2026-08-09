def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a


def euler_phi(n):
    count = 0
    for k in range(1, n + 1):
        if gcd(k, n) == 1:
            count += 1
    return count
