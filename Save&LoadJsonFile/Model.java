import java.util.ArrayList;
import java.io.*;
import java.lang.*;
import java.util.*;
// Sorts map items by their y-values
class ItemYComparator implements Comparator<MapItem>
{
	// Returns a negative value if a.y > b.y
	// Returns zero if a.y == b.y
	// Returns a positive value if a.y < b.y
	public int compare(MapItem a, MapItem b) {
		return a.y - b.y;
  }
}
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

	Json marshal()
	{
		//System.out.println("MapItem marshal called");
		Json ob = Json.newObject();
		ob.add("type", this.type);
		ob.add("x", this.x);
		ob.add("y", this.y);
		return ob;
	}

	public static MapItem unmarshal(Json ob) {
		//System.out.println("MapItem unmarshal called");
		return new MapItem((int)ob.getLong("x"), (int)ob.getLong("y"), (int)ob.getLong("type"));
	}
}

class Model
{
	

	ArrayList<MapItem> items;
	int turtle_x;
	int turtle_y;
	int dest_x;
	int dest_y;
	static int speed = 10;
	public int current_item;

	
	// ItemYComparator compareY;


	Model()
	{
		this.turtle_x = 100;
		this.turtle_y = 100;
		this.dest_x = 150;
		this.dest_y = 100;
		this.items = new ArrayList();

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
	public int getNumValues(){
		return this.items.size();
	}


	public void deleteMapItem(int x, int y)
	{
		if(this.getNumValues() == 0){
			return;
		}
		MapItem min = this.items.get(0);
		int tempValX = min.x;
		int tempValY = min.y;
		int minDistance = (tempValX  - x) * (tempValX  - x) + (tempValY - y) * (tempValY - y);
		int minNum = 0;
		for(int i = 0; i < this.getNumValues(); i++)
		{
			MapItem temp = this.items.get(i);
			int xVal = temp.x;
			int yVal = temp.y;

			int distance = (xVal - x) * (xVal - x) + (yVal - y) * (yVal - y);
			if(distance < minDistance)
			{
				minDistance = distance;
				minNum = i;
			}


		}
		this.items.remove(minNum);
	}
	public void sortValues(){

		this.items.sort(new ItemYComparator());
	}
	public Json marshal(View view)
	{
		Json map = Json.newObject();
		Json list_of_map_items = Json.newList();
		map.add("items", list_of_map_items);
		for (MapItem item : this.items)
		{
			list_of_map_items.add(item.marshal());
			map.add("horScroll", view.horScroll);
			map.add("vertScroll", view.vertScroll);
		}
		//System.out.println("model marshal called");
		return map;
	}

	public void unmarshal(Json ob, View view)
	{

		this.items = new ArrayList<MapItem>();
		Json tempList = ob.get("items");
		for(int i = 0; i < tempList.size(); i++){
			MapItem temp = MapItem.unmarshal(tempList.get(i));
			this.items.add(temp);
		}
		
		
		view.horScroll = (int)ob.getLong("horScroll");
		view.vertScroll = (int)ob.getLong("vertScroll");
		//System.out.println("model unmarshal called");


	}
}
