
type TimerProps = {
    time: number
}
export default function Timer({ time }: TimerProps) {
    return (
        <div>
            <span className="digits">
                {("0" + Math.floor((time / 60 / 60) % 60)).slice(-2)}:
            </span>
            <span className="digits">
                {("0" + Math.floor((time / 60) % 60)).slice(-2)}:
            </span>
            <span className="digits">
                {("0" + Math.floor((time) % 60)).slice(-2)}
            </span>
        </div>
    );
}