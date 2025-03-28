import { categorySchema } from "~/utils/validation";
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const session = await getUserSession(event);

  if (session.user && session.user.role === "ADMIN") {
    const { name } = await readValidatedBody(event, (body) =>
      categorySchema.parse(body)
    );

    const category = await db.category.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return category;
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized. You dont have admin permission",
    });
  }
});
