import math


def shannon_entropy(probabilities):
    total = 0.0
    for p in probabilities:
        if p > 0:
            total -= p * math.log2(p)
    return total
