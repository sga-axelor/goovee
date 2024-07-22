// ---- CORE IMPORTS ---- //
import {Avatar, AvatarFallback, AvatarImage} from '@/ui/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/components';
import {getImageURL} from '@/utils/image';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import type {Comment} from '@/subapps/events/common/ui/components';

export const CommentCard = ({
  id,
  author,
  publicationDateTime,
  image,
  contentComment,
}: Comment) => {
  return (
    <Card className="shadow-none border-none flex p-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={getImageURL(image?.id)} />
        <AvatarFallback>{author?.name}</AvatarFallback>
      </Avatar>
      <div>
        <CardHeader className="pt-0 pl-[0.93rem] pb-2 pr-0">
          <CardTitle className="text-sm font-semibold">
            {author?.name}
          </CardTitle>
          <CardDescription className="text-xs font-normal">
            {i18n.get('Posted on')} {publicationDateTime}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pl-[0.93rem] pb-0 pr-0">
          <p className="text-sm font-normal">{contentComment}</p>
        </CardContent>
      </div>
    </Card>
  );
};
