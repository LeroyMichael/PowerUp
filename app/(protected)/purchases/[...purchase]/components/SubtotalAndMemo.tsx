

export default function SubtotalAndMemo({}){
    return(
      <div className="flex gap-4">
        <div className="w-1/2 border border-red-200">Memo</div>
        <div className="w-1/2 border border-red-200">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp0,00</span>
          </div>

          <hr className="border border-gray-300 my-2"/>

          <div className="flex justify-between">
            <span>Total</span>
            <span>Rp0,00</span>
          </div>
          
          <div>Witholding checkbox</div>

          <hr className="border border-gray-300 my-2"/>

          <div className="flex justify-between">
            <span>Balance</span>
            <span>Rp0,00</span>
          </div>
          
        </div>
      </div>
    )
}