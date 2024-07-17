import { toast } from "@/components/ui/use-toast";
import { Contact } from "@/types/contact.d";

export async function getMerchants(admin_id: String) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/merchants?adminId=${admin_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const merchants: Record<string, any> = data;
      return merchants;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const setActiveMerchant = async (
  merchant_id: String,
  user_id: String
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/merchants/${merchant_id}/activate?user_id=${user_id}`,
    {
      method: "POST",
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      toast({
        title: "There was a problem with your request:",
        variant: "destructive",
        description: `${e}`,
      });
      throw new Error("Failed to fetch data", e);
    });
  return res;
};
