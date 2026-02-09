import { Button } from './Button';

export const Card = ({ title, data, onClick }) => {
  return (
    <>
      <div className="text-center m-5">
        <div className="bg-purple-700 text-white border rounded-t-2xl p-2">
          {title}
        </div>
        <div className="flex flex-col bg-slate-200 rounded-b-2xl p-2">
          <div>
            {data.map((room) => (
              <div key={room.id}>
                <span>{room.name}</span>
                <span>{room.capacity}</span>
              </div>
            ))}
          </div>
          <Button onClick={onClick} buttonTitle="Consultar sales"></Button>
        </div>
      </div>
    </>
  );
};
