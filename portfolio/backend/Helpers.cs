namespace a;

public static class H{
    public static int Reverse(this int a)
    {
        while (a > 0)
        {
            int lastDigit = a % 10;
            a /= 10;
        }
        return a;
    }
}