export class MathUtils
{

    public static readonly DEG_TO_RAD : number = Math.PI / 180;
    public static readonly RAD_TO_DEG : number = 180/ Math.PI;
    

    public static sinDeg(degree: number) : number
    {
        return Math.sin(degree * this.DEG_TO_RAD);
    }

    public static cosDeg(degree: number) : number
    {
        return Math.cos(degree * this.DEG_TO_RAD);
    }

}