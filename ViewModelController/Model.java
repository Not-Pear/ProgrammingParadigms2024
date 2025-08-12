import java.util.ArrayList;
class MapItem
{
	public int x;
	public int y;
	public int type;

	MapItem(int x, int y, int type)
	{
		this.x = x;
		this.y = y;
		this.type = type;
	}
}
class Model
{
	

	ArrayList<MapItem> items;
	int turtle_x;
	int turtle_y;
	int dest_x;
	int dest_y;
	static int speed = 4;
	public int current_item;


	Model()
	{
		this.turtle_x = 100;
		this.turtle_y = 100;
		this.dest_x = 150;
		this.dest_y = 100;
		this.items = new ArrayList<MapItem>();

	}

	public void update()
	{
		if(this.turtle_x < this.dest_x)
            this.turtle_x += Math.min(speed, this.dest_x - this.turtle_x);
		else if(this.turtle_x > this.dest_x)
            this.turtle_x -= Math.max(speed, this.dest_x - this.turtle_x);
		if(this.turtle_y < this.dest_y)
            this.turtle_y += Math.min(speed, this.dest_y - this.turtle_y);
		else if(this.turtle_y > this.dest_y)
            this.turtle_y -= Math.max(speed, this.dest_y - this.turtle_y);
	}

    public void reset()
    {
        this.turtle_x = 200;
        this.turtle_y = 200;
        this.dest_x = this.turtle_x;
        this.dest_y = this.turtle_y;
    }

	public void setDestination(int x, int y)
	{
		this.dest_x = x;
		this.dest_y = y;
	}
	public void addMapItem(int x, int y)
	{
		MapItem i = new MapItem(x, y, this.current_item);
		this.items.add(i);
	}
	public void change_item()
	{
		if(this.current_item == 9){
			this.current_item = 0;
		}
		else{
			this.current_item = this.current_item + 1;
		}
		
	}
}

